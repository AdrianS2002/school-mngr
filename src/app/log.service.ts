// log.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class LogService {
  constructor(private firestore: Firestore) {}

  log(message: string, userEmail: string = 'anonymous', actionType: string = 'GENERIC') {
    const logRef = collection(this.firestore, 'logs');
    return addDoc(logRef, {
      message,
      userEmail,
      actionType,
      timestamp: Timestamp.now()
    });
  }
  
}
