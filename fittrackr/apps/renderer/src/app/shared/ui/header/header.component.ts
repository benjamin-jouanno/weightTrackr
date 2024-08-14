import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProfil } from '../../utils/types/profil.type';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {

  @Input() profile: IProfil | undefined;
}
