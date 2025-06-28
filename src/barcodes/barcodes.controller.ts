import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BarcodesService } from './barcodes.service';
import { Barcode } from './entities/barcode.entity';

@Controller('barcodes')
export class BarcodesController {
  constructor(private readonly barcodesService: BarcodesService) { }

  @Post('create')
  async create(@Body() barcodeData: Barcode): Promise<Barcode> {
    return this.barcodesService.create(barcodeData);
  }

  @Post('createMultiple')
  async createMultiple(@Body() barcodeData: Barcode): Promise<Barcode> {
    return this.barcodesService.createMultiple(barcodeData);
  }

  @Post('all')
  async findAll(@Body('pageData') pageData: any): Promise<Request[]> {
    return this.barcodesService.findAll(pageData);
  }

  //////////////////////////////////////////////////////////////////////////

  // Controlador para buscar por keyword
  @Post('findByQuery')
  async findByQuery(@Body('keyword') keyword: string): Promise<Barcode[]> {
    return this.barcodesService.findByQuery(keyword);
  }

}
