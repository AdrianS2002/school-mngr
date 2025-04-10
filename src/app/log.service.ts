// log.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import { LogActionType } from './log-action-type.enum';

@Injectable({ providedIn: 'root' })
export class LogService {
  constructor(private firestore: Firestore) {}

  log(
    message: string,
    userEmail: string = 'anonymous',
    actionType: LogActionType = LogActionType.GENERIC,
    metadata?: any // 
  ) {
    const logRef = collection(this.firestore, 'logs');
  
    const logData: any = {
      message,
      userEmail,
      actionType,
      timestamp: Timestamp.now()
    };
  
    
    if (metadata !== undefined) {
      logData.metadata = metadata;
    }
  
    return addDoc(logRef, logData);
  }
  
  
}
