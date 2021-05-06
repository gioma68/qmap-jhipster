import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IE, E } from '../e.model';
import { EService } from '../service/e.service';

@Component({
  selector: 'jhi-e-update',
  templateUrl: './e-update.component.html',
})
export class EUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
  });

  constructor(protected eService: EService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ e }) => {
      this.updateForm(e);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const e = this.createFromForm();
    if (e.id !== undefined) {
      this.subscribeToSaveResponse(this.eService.update(e));
    } else {
      this.subscribeToSaveResponse(this.eService.create(e));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IE>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(e: IE): void {
    this.editForm.patchValue({
      id: e.id,
    });
  }

  protected createFromForm(): IE {
    return {
      ...new E(),
      id: this.editForm.get(['id'])!.value,
    };
  }
}
