import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,  } from '@angular/forms';

import { global } from '../../services/global';

import { StudentService } from '../../services/student.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Email } from '../../models/email';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  forma: FormGroup;
  public email: Email;

 // public book: Book;
  public url;

  constructor(
    private fb: FormBuilder,
    private studentservice: StudentService,
    private http: HttpClient,
    public snackBar: MatSnackBar
  ) { 
    this.crearFormulario();
  }

  ngOnInit(): void {
  }

  get nameNoValido() {
    return this.forma.get('name').invalid && this.forma.get('name').touched;
  }

  get emailNoValido() {
  return this.forma.get('email').invalid && this.forma.get('email').touched;
}

  get messageNoValido() {
    return this.forma.get('message').invalid && this.forma.get('message').touched;
  }

  crearFormulario() 
  {

    this.forma = this.fb.group({
      name  : ['', [ Validators.required, Validators.minLength(4) ]  ],
      email : ['', Validators.required ],
      message : ['', Validators.required ],

    });


  }

  send()
  {
    console.log("enviado");
    if ( this.forma.invalid ) {

      return Object.values( this.forma.controls ).forEach( control => {

        if ( control instanceof FormGroup ) {
          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });
    }
    else
    {
      this.email = this.forma.value;
      this.studentservice.sendEmail(this.email).subscribe(
      response =>
        {
          console.log(this.email);
          
          
       },
      error =>
      {
      console.log(error);
      } 
      
      );
      this.snackBar.open('email sent', 'Close',{ duration:3000 });
      this.forma.reset();
    }

  }

}
