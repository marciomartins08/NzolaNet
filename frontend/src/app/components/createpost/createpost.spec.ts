import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createpost } from './createpost';

describe('Createpost', () => {
  let component: Createpost;
  let fixture: ComponentFixture<Createpost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createpost],
    }).compileComponents();

    fixture = TestBed.createComponent(Createpost);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
