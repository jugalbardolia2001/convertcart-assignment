import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = Number(process.env.PORT || process.env.SEGMENT_SERVICE_PORT || 4001)

app.listen(PORT, () => {
  console.log(`Segment service listening on port ${PORT}`);
});

