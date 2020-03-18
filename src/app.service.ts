import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

const serviceAccount = require('./config/kjer-si-firebase-adminsdk-v1eil-b7f0b466dc.json');

@Injectable()
export class AppService {

  firebaseError: string;

  constructor() {
    // ...
  }

  init() {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } catch (e) {
      console.error('Firebase init error: ', e);
      this.firebaseError = e;
    }
  }
}
