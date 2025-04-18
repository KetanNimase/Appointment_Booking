import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { init, send } from '@emailjs/nodejs';

// Define interfaces for request bodies
interface SendOTPRequest {
  appointment_id: number;
}

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// PostgreSQL Database connection
const pool = new Pool({
  connectionString: 'postgresql://postgres.qhtesehrobdzvqqeultb:Appt123@aws-0-ap-south-1.pooler.supabase.com:6543/postgres'
});

// Initialize EmailJS
init({
  publicKey: "ngfcrIBDBDILAGrej",
  privateKey: "your_private_key",
});

// Database initialization
const initDb = async () => {
  try {
    const client = await pool.connect();
    
    // Create or update tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        location_id INTEGER,
        appointment_date DATE,
        appointment_time TIME,
        patient_name VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(20),
        verification_status VARCHAR(10) DEFAULT 'pending'
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS patient_details (
        id SERIAL PRIMARY KEY,
        appointment_id INTEGER,
        legal_first_name VARCHAR(100),
        last_name VARCHAR(100),
        preferred_name VARCHAR(100),
        dob DATE,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS verification_codes (
        id SERIAL PRIMARY KEY,
        appointment_id INTEGER,
        code VARCHAR(6),
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS booked_slots (
        id SERIAL PRIMARY KEY,
        provider_id INTEGER,
        appointment_date DATE,
        appointment_time TIME,
        patient_name VARCHAR(100),
        location VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Reset the sequence for booked_slots table to avoid primary key conflicts
    await client.query(`
      SELECT setval('booked_slots_id_seq', (SELECT COALESCE(MAX(id), 0) FROM booked_slots) + 1, false);
    `);

    client.release();
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Error handler middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
};

// API Routes
// Appointments
app.post('/api/appointments', async (req: Request, res: Response) => {
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

    const result = await pool.query(
      'INSERT INTO appointments (location_id, appointment_date, appointment_time, patient_name, email, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [location_id, appointment_date, appointment_time, patient_name, email, phone]
    );

    res.json({ success: true, appointmentId: result.rows[0].id });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Verification
app.post('/api/verify/verify-otp', async (req: Request, res: Response) => {
  try {
    const { appointment_id, code } = req.body;
    const codes = await pool.query(
      'SELECT * FROM verification_codes WHERE appointment_id = $1 AND code = $2 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [appointment_id, code]
    );

    if (codes.rows.length > 0) {
      await pool.query(
        'UPDATE appointments SET verification_status = $1 WHERE id = $2',
        ['verified', appointment_id]
      );
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid or expired code' });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Locations
app.get('/api/locations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locations = await pool.query('SELECT * FROM locations');
    res.json(locations.rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/locations/:id', async (req: Request, res: Response) => {
  try {
    const locations = await pool.query(
      'SELECT * FROM locations WHERE id = $1',
      [req.params.id]
    );
    
    if (locations.rows.length > 0) {
      res.json(locations.rows[0]);
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
});

app.get('/api/locations/:id/hours', async (req: Request, res: Response) => {
  try {
    const hours = await pool.query(
      'SELECT * FROM office_hours WHERE location_id = $1 ORDER BY CASE day_of_week ' +
      'WHEN \'Monday\' THEN 1 ' +
      'WHEN \'Tuesday\' THEN 2 ' +
      'WHEN \'Wednesday\' THEN 3 ' +
      'WHEN \'Thursday\' THEN 4 ' +
      'WHEN \'Friday\' THEN 5 ' +
      'WHEN \'Saturday\' THEN 6 ' +
      'WHEN \'Sunday\' THEN 7 END',
      [req.params.id]
    );
    res.json(hours.rows);
  } catch (error) {
    console.error('Error fetching office hours:', error);
    res.status(500).json({ error: 'Failed to fetch office hours' });
  }
});

// Providers
app.get('/api/providers', async (req: Request, res: Response) => {
  try {
    const providers = await pool.query('SELECT * FROM providers');
    res.json(providers.rows);
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});

app.get('/api/locations/:locationId/providers', async (req: Request, res: Response) => {
  try {
    const providers = await pool.query(
      'SELECT * FROM providers WHERE location_id = $1',
      [req.params.locationId]
    );
    res.json(providers.rows);
  } catch (error) {
    console.error('Error fetching providers by location:', error);
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});

// Appointment reasons
app.get('/api/appointment-reasons', async (req: Request, res: Response) => {
  try {
    const reasons = await pool.query('SELECT * FROM appointment_reasons');
    res.json(reasons.rows);
  } catch (error) {
    console.error('Error fetching appointment reasons:', error);
    res.status(500).json({ error: 'Failed to fetch appointment reasons' });
  }
});

// Booking slots
app.get('/api/booked-slots', async (req: Request, res: Response) => {
  try {
    const { provider_id } = req.query;
    const slots = await pool.query(
      'SELECT appointment_date, appointment_time, provider_id FROM booked_slots WHERE provider_id = $1',
      [provider_id]
    );
    res.json(slots.rows);
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    res.status(500).json({ error: 'Failed to fetch booked slots' });
  }
});

// Add a route to handle /api/booked-slots/:providerId format
app.get('/api/booked-slots/:providerId', async (req: Request, res: Response) => {
  try {
    const providerId = req.params.providerId;
    const slots = await pool.query(
      'SELECT appointment_date, appointment_time, provider_id FROM booked_slots WHERE provider_id = $1',
      [providerId]
    );
    res.json(slots.rows);
  } catch (error) {
    console.error('Error fetching booked slots by provider ID:', error);
    res.status(500).json({ error: 'Failed to fetch booked slots' });
  }
});

app.post('/api/book-slot', async (req: Request, res: Response): Promise<any> => {
  try {
    const { provider_id, appointment_date, appointment_time, patient_name, location } = req.body;
    
    // Check if slot is already booked
    const existing = await pool.query(
      'SELECT id FROM booked_slots WHERE provider_id = $1 AND appointment_date = $2 AND appointment_time = $3',
      [provider_id, appointment_date, appointment_time]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Slot already booked' });
    }

    // Book the slot - handle case where location might be missing
    if (location) {
      await pool.query(
        'INSERT INTO booked_slots (provider_id, appointment_date, appointment_time, patient_name, location) VALUES ($1, $2, $3, $4, $5)',
        [provider_id, appointment_date, appointment_time, patient_name, location]
      );
    } else {
      await pool.query(
        'INSERT INTO booked_slots (provider_id, appointment_date, appointment_time, patient_name) VALUES ($1, $2, $3, $4)',
        [provider_id, appointment_date, appointment_time, patient_name]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error booking slot:', error);
    res.status(500).json({ error: 'Failed to book slot' });
  }
});

// Apply error handler
app.use(errorHandler);

// Wrap initDb call in async IIFE to avoid top-level await
(async () => {
  try {
    await initDb();
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
})();
