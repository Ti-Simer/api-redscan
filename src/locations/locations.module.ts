import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { Location } from './entities/location.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barcode } from 'src/barcodes/entities/barcode.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, Barcode]),
  ],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule { }
