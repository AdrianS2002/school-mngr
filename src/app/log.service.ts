// log.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class LogService {
  constructor(private firestore: Firestore) {}

  log(
    message: string,
    userEmail: string = 'anonymous',
    actionType: string = 'GENERIC',
    metadata?: any // ✅ al patrulea argument opțional
  ) {
    const logRef = collection(this.firestore, 'logs');
  
    const logData: any = {
      message,
      userEmail,
      actionType,
      timestamp: Timestamp.now()
    };
  
    // ✅ evităm undefined (Firestore nu permite)
    if (metadata !== undefined) {
      logData.metadata = metadata;
    }
  
    return addDoc(logRef, logData);
  }
  
  
}
