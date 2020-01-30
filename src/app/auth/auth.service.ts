import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private eventAuthError = new BehaviorSubject<string>('');
  eventAuthError$ = this.eventAuthError.asObservable();
  newUser: any;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) {}

  createUser(user) {
    this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
    .then (userCredential => {
      this.newUser = user;
      userCredential.user.updateProfile({
        displayName: user.firstName + ' ' + user.lastName
      });
      this.insertUserData(userCredential)
      .then( () => {
        this.router.navigate(['/home']);
      });
    })
    .catch(error => {
      this.eventAuthError.next(error);
    });
  }

  getUserState() {
    return this.afAuth.authState;
  }

  insertUserData(userCredential: firebase.auth.UserCredential) {
    return this.db.doc(`Users/${userCredential.user.uid}`).set({
          email: this.newUser.email,
          fistName: this.newUser.firstName,
          lastName: this.newUser.lastName,
          role: 'USUARIO WEB'
        }
    );
  }

  logout() {
    return this.afAuth.auth.signOut();
  }
}

