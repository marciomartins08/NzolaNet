import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComentarios } from './admin-comentarios';

describe('AdminComentarios', () => {
  let component: AdminComentarios;
  let fixture: ComponentFixture<AdminComentarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComentarios],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComentarios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
