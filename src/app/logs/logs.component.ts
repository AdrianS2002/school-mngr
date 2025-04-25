import { Component, OnInit } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

interface LogEntry {
  id: string;
  userEmail: string;
  actionType: string;
  message: string;
  timestamp: any;
}

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  rowData: LogEntry[] = [];

  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'userEmail', headerName: 'User', flex: 1 },
    { field: 'actionType', headerName: 'Action', flex: 1 },
    { field: 'message', headerName: 'Message', flex: 1 },
    {
      field: 'message',
      headerName: 'Message',
      flex: 1,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
      cellClass: 'message-cell'
    }
  ];

  gridOptions: GridOptions = {
    defaultColDef: {
      resizable: true,
      sortable: true,
      filter: true,
      wrapText: false,
      autoHeight: false
    },
    pagination: true,
    paginationPageSize: 70,
    animateRows: true,
    rowHeight: 48,
    domLayout: 'normal'
  };

  constructor(private firestore: Firestore) { }

  async ngOnInit() {
    const snapshot = await getDocs(collection(this.firestore, 'logs'));
    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LogEntry[];

    logs.sort((a, b) =>
      (a.timestamp?.toDate?.().getTime?.() || new Date(a.timestamp).getTime()) -
      (b.timestamp?.toDate?.().getTime?.() || new Date(b.timestamp).getTime())
    );

    this.rowData = logs.reverse();
    console.log('Loaded logs:', this.rowData);
  }

  onGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }

  formatTimestamp(params: any): string {
    const ts = params.value;
    if (!ts) return '';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleString();
  }
}
