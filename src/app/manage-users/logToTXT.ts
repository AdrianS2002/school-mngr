import { Firestore, collection, getDocs } from '@angular/fire/firestore';

interface LogEntry {
  id: string;
  message: string;
  userEmail: string;
  actionType: string;
  timestamp: any;
  metadata?: { [key: string]: any };
}

export async function exportLogsToTXT(firestore: Firestore): Promise<string> {
  const logsRef = collection(firestore, 'logs');
  const snapshot = await getDocs(logsRef);

  if (snapshot.empty) return '';

  const logs: LogEntry[] = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as LogEntry[];

  logs.sort((a, b) => {
    const aTime = a.timestamp?.toDate?.().getTime?.() || new Date(a.timestamp).getTime();
    const bTime = b.timestamp?.toDate?.().getTime?.() || new Date(b.timestamp).getTime();
    return bTime - aTime;
  });

  const lines: string[] = [];

  logs.forEach((log, index) => {
    lines.push(`Log #${index + 1}`);
    lines.push(`ID: ${log.id}`);
    lines.push(`User: ${log.userEmail}`);
    lines.push(`Action: ${log.actionType}`);
    lines.push(`Message: ${log.message}`);
    lines.push(`Timestamp: ${log.timestamp?.toDate?.().toISOString?.() || log.timestamp}`);

    if (log.metadata) {
      lines.push(`Metadata:`);
      Object.entries(log.metadata).forEach(([key, value]) => {
        lines.push(`  - ${key}: ${value}`);
      });
    }

    lines.push(''); 
  });

  return lines.join('\n');
}
