import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { init, send } from '@emailjs/nodejs';

// Define interface for the request body
interface SendOTPRequest {
  appointment_id: number;
}

const app = express();

app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Database connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'appointment_booking',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Add new table for patient details and verification
const initDb = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Add verification status to appointments table
    await connection.execute(`
      ALTER TABLE appointments 
      ADD COLUMN IF NOT EXISTS verification_status ENUM('pending', 'verified') 
      DEFAULT 'pending'
    `);

    // Create patient_details table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS patient_details (
        id INT PRIMARY KEY AUTO_INCREMENT,
        appointment_id INT,
        legal_first_name VARCHAR(100),
        last_name VARCHAR(100),
        preferred_name VARCHAR(100),
        dob DATE,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id)
      )
    `);

    // Create verification_codes table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS verification_codes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        appointment_id INT,
        code VARCHAR(6),
        expires_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id)
      )
    `);

    connection.release();
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

initDb();

// API Routes
app.post('/api/appointments', async (req, res) => {
  try {
    const { 
      location_id, 
      appointment_date, 
      appointment_time,
      patient_name,
      email,
      phone,
      provider_id
    } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO appointments (location_id, appointment_date, appointment_time, patient_name, email, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [location_id, appointment_date, appointment_time, patient_name, email, phone]
    );

    res.json({ success: true, appointmentId: (result as any).insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});


// Initialize EmailJS at the top of the file after imports
init({
  publicKey: "ngfcrIBDBDILAGrej",
  privateKey: "your_private_key", // Add your private key here
});

// Update the send-otp endpoint
// app.post('/api/verify/send-otp', async (req: Request, res: Response) => {
//   try {
//     const { appointment_id } = req.body;
//     const code = Math.floor(1000 + Math.random() * 9000).toString();
//     const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

//     // Get appointment and patient details
//     const [appointments] = await pool.execute(
//       'SELECT a.*, p.legal_first_name FROM appointments a LEFT JOIN patient_details p ON a.id = p.appointment_id WHERE a.id = ?',
//       [appointment_id]
//     );

//     if (!Array.isArray(appointments) || appointments.length === 0) {
//       return res.status(404).json({ error: 'Appointment not found' });
//     }

//     const appointment = appointments[0] as any;

//     // Store the verification code
//     await pool.execute(
//       'INSERT INTO verification_codes (appointment_id, code, expires_at) VALUES (?, ?, ?)',
//       [appointment_id, code, expiresAt]
//     );

//     // Send email with verification code using EmailJS
//     const emailResponse = await send(
//       'service_o2jqb25',
//       'template_jia3vs7',
//       {
//         to_name: appointment.legal_first_name || appointment.patient_name || 'Patient',
//         to_email: appointment.email,
//         otp: code,
//         expiry_time: '15 minutes'
//       }
//     );

//     if (emailResponse.status === 200) {
//       res.json({ 
//         success: true, 
//         message: 'Verification code sent successfully',
//         code: code // Only for testing, remove in production
//       });
//     } else {
//       throw new Error('Failed to send email');
//     }

//   } catch (error) {
//     console.error('Error sending verification code:', error);
//     res.status(500).json({ error: 'Failed to send verification code' });
//   }
// });

app.post('/api/verify/verify-otp', async (req, res) => {
  try {
    const { appointment_id, code } = req.body;
    const [codes] = await pool.execute(
      'SELECT * FROM verification_codes WHERE appointment_id = ? AND code = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [appointment_id, code]
    );

    if (Array.isArray(codes) && codes.length > 0) {
      await pool.execute(
        'UPDATE appointments SET verification_status = "verified" WHERE id = ?',
        [appointment_id]
      );
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid or expired code' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Add these endpoints after your existing routes

// Get all locations with their details
// Update other routes with proper types
app.get('/api/locations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [locations] = await pool.execute('SELECT * FROM locations');
    res.json(locations);
  } catch (error) {
    next(error);
  }
});

// Get office hours for a specific location
app.get('/api/locations/:id/hours', async (req, res) => {
  try {
    const [hours] = await pool.execute(
      'SELECT * FROM office_hours WHERE location_id = ? ORDER BY FIELD(day_of_week, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")',
      [req.params.id]
    );
    res.json(hours);
  } catch (error) {
    console.error('Error fetching office hours:', error);
    res.status(500).json({ error: 'Failed to fetch office hours' });
  }
});

// Get location details by ID
app.get('/api/locations/:id', async (req, res) => {
  try {
    const [locations] = await pool.execute(
      'SELECT * FROM locations WHERE id = ?',
      [req.params.id]
    );
    
    if (Array.isArray(locations) && locations.length > 0) {
      res.json(locations[0]);
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
});

// Add these new endpoints

// Get all providers
app.get('/api/providers', async (req, res) => {
  try {
    const [providers] = await pool.execute('SELECT * FROM providers');
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});

// Get providers by location
app.get('/api/locations/:locationId/providers', async (req, res) => {
  try {
    const [providers] = await pool.execute(
      'SELECT * FROM providers WHERE location_id = ?',
      [req.params.locationId]
    );
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});

// Get appointment reasons
app.get('/api/appointment-reasons', async (req, res) => {
  try {
    const [reasons] = await pool.execute('SELECT * FROM appointment_reasons');
    res.json(reasons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointment reasons' });
  }
});