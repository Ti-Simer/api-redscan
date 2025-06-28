import { Module } from '@nestjs/common';
import { BarcodesService } from './barcodes.service';
import { BarcodesController } from './barcodes.controller';
import { Barcode } from './entities/barcode.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Barcode]),
  ],
  controllers: [BarcodesController],
  providers: [BarcodesService],
})
export class BarcodesModule { }
