import { Component } from '@angular/core';
import { output } from '@angular/core';


@Component({
  selector: 'app-createpost',
  imports: [],
  templateUrl: './createpost.html',
  styleUrl: './createpost.css',
})
export class Createpost {
  dataPost = output<{
    text: string;
    fileImage?: File | null;
    fileVideo?: File | null;
  }>();

  text: string = '';
  image: string = '';
  video: string = '';

  fileImage: File | null = null;
  fileVideo: File | null = null;
  imagePreview: string | null = null;
  videoPreview: string | null = null;
  onImageChange(event: any){
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];  
    this.fileImage = file;
    this.imagePreview = URL.createObjectURL(file);
  }
  onVideoChange(event: any){
      const input = event.target as HTMLInputElement;

      if (!input.files || input.files.length === 0) return;

      const file = input.files[0];
      this.fileVideo = file;

      this.videoPreview = URL.createObjectURL(file);
  }
  onText(event: any){
    this.text = event.target.value;
  }
  removeImage(){
    this.fileImage = null;
    this.imagePreview = null;
  }
  removeVideo(){
    this.fileVideo = null;
    this.videoPreview = null;
  }
  
  submitPost(){
    this.dataPost.emit({
      text: this.text,
      fileImage: this.fileImage,
      fileVideo: this.fileVideo
    });
    this.text = '';
    this.removeImage();
    this.removeVideo();
  }
}
