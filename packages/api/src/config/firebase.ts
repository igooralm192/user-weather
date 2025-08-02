import admin, { ServiceAccount } from 'firebase-admin';
import { env } from './env';
import serviceAccount from '../../firebase-service-account.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    databaseURL: env.FIREBASE_RTDB_URL,
  });
}

export const db = admin.database();

export const getRef = (path: string): admin.database.Reference => {
  if (env.NODE_ENV === 'test') {
    return db.ref(`tests/${path}`);
  }

  return db.ref(path);
}

export const cleanTestDb = async () => {
  if (env.NODE_ENV !== 'test') {
    return;
  }

  return db.ref('tests').remove();
}

export default admin;
