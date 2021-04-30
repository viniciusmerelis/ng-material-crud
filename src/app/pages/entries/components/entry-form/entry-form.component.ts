import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category } from 'src/app/pages/categories/shared/category.model';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';
import { Entry, EntryType } from '../../shared/entry.model';
import { CategoryService } from './../../../categories/shared/category.service';
import { EntryService } from './../../shared/entry.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit {

  categories: Category[];
  typeOptions: { value: EntryType, text: string }[] = [
    { value: 'expense', text: 'Despesa' },
    { value: 'revenue', text: 'Receita' }
  ];

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  constructor(
    protected injector: Injector,
    protected entryService: EntryService,
    protected categoryService: CategoryService,
    private _snakeBar: MatSnackBar
  ) {
    super(injector, new Entry(), entryService, Entry.fromJson)
  }

  ngOnInit() {
    this.loadCategories();
    super.ngOnInit();
  }


  protected buildResourceForm() {
    const type: EntryType = 'expense';
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [type, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  protected loadCategories() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    );
  }

  protected creationPageTitle(): string {
    return 'Cadastro de Novo Lançamento';
  }

  protected editionPageTitle(): string {
    const resourceName = this.resource.name || '';
    return `Editando Lançamento: ${resourceName}`;
  }

  openSnackBar() {
    this._snakeBar.open('Cadastro criado com sucesso!', null, {
      duration: 5000
    });
  }

}