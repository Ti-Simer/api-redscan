import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Barcode } from './entities/barcode.entity';
import { ResponseUtil } from 'src/utils/response.util';

@Injectable()
export class BarcodesService {
  constructor(
    @InjectRepository(Barcode) private barcodeRepository: Repository<Barcode>,
  ) { }

  async create(barcodeData: Barcode): Promise<any> {
    try {
      if (barcodeData) {

        const existingBarcode = await this.barcodeRepository.findOne({
          where: { code: barcodeData.code, location: barcodeData.location },
        });

        if (existingBarcode) {
          this.update(barcodeData);
          return ResponseUtil.success(
            201,
            'Código actualizado exitosamente'
          );
        }

        if (!barcodeData.date) {
          const date = new Date();
          // transformar a formato 2025-06-19 09:18:06
          barcodeData.date = date.toISOString().slice(0, 19).replace('T', ' ');
        }

        // Extraer keywords
        const keywords = [
          barcodeData.code,
          barcodeData.name,
          barcodeData.document,
          barcodeData.address,
          barcodeData.location,
        ].join(', ');

        const newBarcode = this.barcodeRepository.create({
          ...barcodeData,
          keywords,
          state: 'ACTIVO',
        });

        const createdLocation = await this.barcodeRepository.save(newBarcode);

        if (createdLocation) {
          return ResponseUtil.success(
            200,
            'Código creado exitosamente',
            createdLocation
          );
        } else {
          console.error('Error en barcodes/create:', createdLocation);
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear El código'
          );
        }
      }
    } catch (error) {
      console.error('Error al crear el código:', error);
      return ResponseUtil.error(
        500,
        'Error al crear El código'
      );
    }
  }

  async update(barcodeData) {
    try {
      const existingBarcode = await this.barcodeRepository.findOne({
        where: { code: barcodeData.code, location: barcodeData.location },
      });

      if (!existingBarcode) {
        return ResponseUtil.error(
          400,
          'Código no encontrado'
        );
      }

      const updatedLocation = await this.barcodeRepository.save({
        ...existingBarcode,
        ...barcodeData,
      });

      if (updatedLocation) {
        // Salida por consola para actualización exitosa
        console.log('Código actualizado exitosamente:', updatedLocation);

        return ResponseUtil.success(
          201,
          'Código actualizado exitosamente',
          updatedLocation
        );
      }

    } catch (error) {
      return ResponseUtil.error(
        404,
        'Código no encontrao'
      );
    }
  }

  async findAll(pageData: any): Promise<any> {
    try {
      const [barcodes, total] = await this.barcodeRepository.findAndCount({
        where: {
          state: 'ACTIVO',
          location: pageData.location
        },
        skip: (pageData.page - 1) * pageData.limit,
        take: pageData.limit,
        order: {
          id: 'DESC'
        }
      });

      if (barcodes.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Codigos'
        );
      }

      return ResponseUtil.success(
        200,
        'Codigos encontrados',
        {
          barcodes,
          total,
          page: pageData.page,
          limit: pageData.limit,
        }
      );
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener los Codigos'
      );
    }
  }


  /////////////////////////////////////////////////////////////////////////////////////

  async createMultiple(data: any): Promise<any> {
    const chunkSize = 500;
    const createdBarcodes = [];

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const promises = chunk.map((item: any) => this.create(item));
      const responses = await Promise.all(promises);

      const successfulBarcodes = responses
        .filter(response => response.statusCode === 200)
        .map(response => response.data.id);

      createdBarcodes.push(...successfulBarcodes);
    }

    if (createdBarcodes.length === 0) {
      return ResponseUtil.error(
        400,
        'No se han creado códigos'
      );
    }

    return ResponseUtil.success(
      200,
      'Codigos creados exitosamente',
      createdBarcodes
    );
  }

  // Buscar por keyword
  async findByQuery(keyword: string): Promise<any> {
    try {
      const barcodes = await this.barcodeRepository
      .createQueryBuilder('barcode')
      .where('barcode.keywords LIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();

      if (barcodes.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Codigos'
        );
      }

      return ResponseUtil.success(
        200,
        'Codigos encontrados',
        barcodes
      );
    } catch (error) {
      console.error('Error al buscar códigos por keyword:', error);
      return ResponseUtil.error(
        500,
        'Error al buscar Codigos'
      );
    }
  }
}
