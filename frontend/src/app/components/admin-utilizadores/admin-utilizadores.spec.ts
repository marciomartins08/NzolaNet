import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUtilizadores } from './admin-utilizadores';

describe('AdminUtilizadores', () => {
  let component: AdminUtilizadores;
  let fixture: ComponentFixture<AdminUtilizadores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUtilizadores],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUtilizadores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
