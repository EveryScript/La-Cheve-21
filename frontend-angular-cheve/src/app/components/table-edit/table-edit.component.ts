import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Imports principales
import { Table } from 'src/app/models/Table';
import { TableService } from 'src/app/services/table.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-table-edit',
  templateUrl: './table-edit.component.html',
  styleUrls: ['./table-edit.component.css'],
  providers: [ TableService, UserService ]
})
export class TableEditComponent implements OnInit {
  // Propiedades
  public token = this._userService.getToken();
  public table_id: string;
  public table = new Table('', 'MESA ', '', '');
  public areas: any;
  public area_form_status = false;
  public edit_mode: boolean;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _tableService: TableService,
    private _userService: UserService
  ){
    this.edit_mode = false;
    this.table_id = '';
    // Cargar datos si hay parametro por la url
    this._route.params.subscribe( params => {
      this.table_id = params['id'];
      if(this.table_id) {
        this._tableService.one(this.table_id).subscribe(
          response => {
            if(response.status == 'success') {
              this.table = response.table;
              this.edit_mode = true;
            }
          }, error => {
            console.log(<any>error);
          }
        );
      }

    });

    // Setear los valores de areas
    this._tableService.allAreas().subscribe(
      response => {
        if(response.status == 'success') {
          this.areas = response.areas;
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }

  ngOnInit(): void {
  }

  // Boton registrar Mesa
  onSubmit(form:any) {
    if(this.edit_mode) {
      this._tableService.update(this.table_id, this.table, this.token).subscribe(
        response => {
          if(response.status == 'success') {
            this._router.navigate(['/table-list']);
          }
        }, error => {
          console.log(<any>error);
        }
      );
    } else {
      this._tableService.save(this.table, this.token).subscribe(
        response => {
          if(response.status == 'success') {
            this._router.navigate(['/table-list']);
          }
        }, error => {
          console.log(<any>error);
        }
      );
    }
  }

  // Boton volver a Mesas
  backToListTables() {
    this._router.navigate(['/table-list']);
  }

  // Boton habilitar formulario de area
  btnEnableAreaForm() {
    if(this.area_form_status) {
      this.area_form_status = false;
    } else {
      this.area_form_status = true;
    }
  }
}
