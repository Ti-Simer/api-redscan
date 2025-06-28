import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { ResponseUtil } from 'src/utils/response.util';
import { Barcode } from 'src/barcodes/entities/barcode.entity';

@Injectable()
export class LocationsService {

  constructor(
    @InjectRepository(Location) private locationRepository: Repository<Location>,
    @InjectRepository(Barcode) private barcodeRepository: Repository<Barcode>,
  ) { }

  async create(locationData: Location): Promise<any> {
    try {
      if (locationData) {

        const existingLocation = await this.locationRepository.findOne({
          where: { name: locationData.name },
        });

        if (existingLocation) {
          return ResponseUtil.error(
            400,
            'La Localidad ya existe'
          );
        }

        const newLocation = this.locationRepository.create({
          ...locationData,
          state: 'ACTIVO',
        });

        const createdLocation = await this.locationRepository.save(newLocation);

        if (createdLocation) {
          return ResponseUtil.success(
            200,
            'Localidad creada exitosamente',
            createdLocation
          );
        } else {
          return ResponseUtil.error(
            500,
            'Ha ocurrido un problema al crear la Localidad'
          );
        }
      }
    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al crear la Localidad'
      );
    }
  }

  async findAll(): Promise<any> {
    try {
      const locations = await this.locationRepository.find({
        where: { state: 'ACTIVO' },
      });

      if (locations.length < 1) {
        return ResponseUtil.error(
          400,
          'No se han encontrado Localidades'
        );
      }

      // Contar cuantos barcodes hay por cada localidad
      for (const location of locations) {
        const barcodeCount = await this.barcodeRepository.count({
          where: { location: location.name, state: 'ACTIVO' },
        });
        location.barcodeCount = barcodeCount;
      }

      return ResponseUtil.success(
        200,
        'Localidades encontradas',
        locations
      );

    } catch (error) {
      return ResponseUtil.error(
        500,
        'Error al obtener las Localidades'
      );
    }
  }

  async update(id, locationData) {
    try {      

      const existingLocation = await this.locationRepository.findOne({
        where: { id },
      });

      if (!existingLocation) {
        return ResponseUtil.error(
          400,
          'Ciudad no encontrada'
        );
      }

      const updatedLocation = await this.locationRepository.save({
        ...existingLocation,
        ...locationData,
      });      

      if (updatedLocation) {
        return ResponseUtil.success(
          200,
          'Ciudad actualizada exitosamente',
          updatedLocation
        );
      }

    } catch (error) {
      return ResponseUtil.error(
        404,
        'Ciudad no encontrada'
      );
    }
  }
}
