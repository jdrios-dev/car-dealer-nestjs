import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateCarDto, UpdateCarDto } from './dto';
import { Car } from './interfaces/car.interface';

@Injectable()
export class CarsService {
  private cars: Car[] = [
    // { id: uuid(), brand: 'Chevy', model: 'Camaro' }
  ];
  findAll() {
    return this.cars;
  }
  findOneById(id: string) {
    const car: Car = this.cars.find((car) => car.id === id);
    if (!car) throw new NotFoundException(`Car with id ${id} Not Found`);

    return car;
  }

  create(createCarDto: CreateCarDto) {
    const newCar: Car = { id: uuid(), ...createCarDto };
    this.cars.push(newCar);
    return newCar;
  }

  update(updateCarDto: UpdateCarDto, id: string) {
    let carDB = this.findOneById(id);
    if (updateCarDto.id && updateCarDto.id !== id)
      throw new BadRequestException(`Car id is not valid`);
    this.cars = this.cars.map((car) => {
      if (car.id === id) {
        carDB = { ...carDB, ...updateCarDto, id };
        return carDB;
      }
      return car;
    });

    return { updateCarDto, id };
  }

  delete(id: string) {
    const carDB = this.findOneById(id);
    if (!carDB) throw new BadRequestException(`Car id is not valid`);
    this.cars = this.cars.filter((car) => car.id !== id);
    return carDB.id;
  }

  fillCarsWithSeedData(cars: Car[]) {
    this.cars = cars;
  }
}
