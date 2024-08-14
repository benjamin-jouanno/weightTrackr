import { NgModule } from "@angular/core";
import { NgxIndexedDBModule } from "ngx-indexed-db";
import { DbConfig } from "./system/dbConfig.conf";
import { CommonModule } from "@angular/common";

const dbConfig = DbConfig;

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        NgxIndexedDBModule.forRoot(dbConfig)  
    ],
    providers: [
    ],
  })
  export class AppModule { }