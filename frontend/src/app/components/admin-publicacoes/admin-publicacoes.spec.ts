import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPublicacoes } from './admin-publicacoes';

describe('AdminPublicacoes', () => {
  let component: AdminPublicacoes;
  let fixture: ComponentFixture<AdminPublicacoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPublicacoes],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPublicacoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
