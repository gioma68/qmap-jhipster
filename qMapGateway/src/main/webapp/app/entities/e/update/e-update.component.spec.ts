jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EService } from '../service/e.service';
import { IE, E } from '../e.model';

import { EUpdateComponent } from './e-update.component';

describe('Component Tests', () => {
  describe('E Management Update Component', () => {
    let comp: EUpdateComponent;
    let fixture: ComponentFixture<EUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let eService: EService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(EUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      eService = TestBed.inject(EService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const e: IE = { id: 456 };

        activatedRoute.data = of({ e });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(e));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const e = { id: 123 };
        spyOn(eService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ e });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: e }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(eService.update).toHaveBeenCalledWith(e);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const e = new E();
        spyOn(eService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ e });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: e }));
        saveSubject.complete();

        // THEN
        expect(eService.create).toHaveBeenCalledWith(e);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const e = { id: 123 };
        spyOn(eService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ e });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(eService.update).toHaveBeenCalledWith(e);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
