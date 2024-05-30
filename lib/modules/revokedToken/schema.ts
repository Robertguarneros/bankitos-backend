import * as mongoose from 'mongoose';

const RevokedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  revokedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('RevokedToken', RevokedTokenSchema);
