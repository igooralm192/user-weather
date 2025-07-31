import admin, { ServiceAccount } from 'firebase-admin';
import { env } from './env';
import serviceAccount from '../../firebase-service-account.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    databaseURL: `https://${env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/`,
  });
}

export const db = admin.database();
export default admin;
