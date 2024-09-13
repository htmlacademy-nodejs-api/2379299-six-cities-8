import { readFileSync } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { ConvenienceType, Coords, HousingType, Offer, User, UserType } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  private validateRawData(): void {
    if (! this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      createdDate,
      city,
      previewImagePath,
      photos,
      isPremium,
      isFavourites,
      rating,
      housingType,
      roomsCount,
      visitorsCount,
      price,
      convenience,
      name,
      email,
      avatarPath,
      password,
      type,
      coords
    ] = line.split('\t');

    return {
      title,
      description,
      createdDate: new Date(createdDate),
      city,
      previewImagePath,
      photos: this.parsePhotos(photos),
      isPremium: isPremium ==='true',
      isFavourites: isFavourites ==='true',
      rating: Number.parseInt(rating, 10),
      housingType: housingType as HousingType,
      roomsCount: Number.parseInt(roomsCount, 10),
      visitorsCount: Number.parseInt(visitorsCount, 10),
      price: Number.parseInt(price, 10),
      convenience: this.parseConvenience(convenience),
      author: this.parseUser(name, email, avatarPath, password, type as UserType ),
      coords: this.parsCoords(coords)
    };
  }


  private parsePhotos(photosString: string): string [] {
    return photosString.split(';').map((name) => ( name ));
  }

  private parseConvenience(convenienceString: string): ConvenienceType[] {
    return convenienceString.split(';').map((name) => ( name as ConvenienceType ));
  }

  private parseUser(name: string, email: string, avatarPath: string, password: string, type: UserType  ): User {
    return { name, email, avatarPath, password, type };
  }

  private parsCoords(coordsString: string): Coords {
    const [ latitude, longitude ] = coordsString.split(';');
    return {
      latitude: Number.parseFloat(latitude),
      longitude: Number.parseFloat(longitude)
    };
  }


  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
