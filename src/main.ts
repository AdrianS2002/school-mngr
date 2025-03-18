import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from './app/auth/store/auth.reducer';
import { AuthEffects } from './app/auth/store/auth.effects';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

const firebaseConfig = {

  apiKey: "AIzaSyCCfSeX7KbzeSLcD6z9sKJ8BJ4gxGJlTn0",

  authDomain: "school-mngr.firebaseapp.com",

  projectId: "school-mngr",

  storageBucket: "school-mngr.firebasestorage.app",

  messagingSenderId: "1017728898774",

  appId: "1:1017728898774:web:e08fb4b5438f383beadb77",

  measurementId: "G-PDPCBKWW1L"

};


console.log("Bootstrapping Application..."); // Debugging

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ auth: authReducer }),
    provideEffects([AuthEffects]),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ]
}).catch((err) => console.error("Bootstrap Error:", err)); // Debugging
