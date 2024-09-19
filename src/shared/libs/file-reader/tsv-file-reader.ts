import EventEmitter from 'node:events';
import { FileReader } from './file-reader.interface.js';
import { ConvenienceType, Coords, HousingType, Offer, User, UserType } from '../../types/index.js';
import { createReadStream } from 'node:fs';

export class TSVFileReader extends EventEmitter implements FileReader {

  private CHUNK_SIZE = 16384;


  constructor(
    private readonly filename: string
  ) {
    super();
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
      isPremium: isPremium === 'true',
      isFavourites: isFavourites === 'true',
      rating: Number.parseInt(rating, 10),
      housingType: housingType as HousingType,
      roomsCount: Number.parseInt(roomsCount, 10),
      visitorsCount: Number.parseInt(visitorsCount, 10),
      price: Number.parseInt(price, 10),
      convenience: this.parseConvenience(convenience),
      author: this.parseUser(name, email, avatarPath, password, type as UserType),
      coords: this.parsCoords(coords)
    };
  }

  private parsePhotos(photosString: string): string [] {
    return photosString.split(';').map((name) => name);
  }

  private parseConvenience(convenienceString: string): ConvenienceType[] {
    return convenienceString.split(';').map((name) => (name as ConvenienceType));
  }

  private parseUser(name: string, email: string, avatarPath: string, password: string, type: UserType): User {
    return { name, email, avatarPath, password, type };
  }

  private parsCoords(coordsString: string): Coords {
    const [ latitude, longitude ] = coordsString.split(';');
    return {
      latitude: Number.parseFloat(latitude),
      longitude: Number.parseFloat(longitude)
    };
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      console.log('nextLinePosition = ', nextLinePosition, 'data = ', chunk.toString());
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        console.log(JSON.stringify(remainingData), JSON.stringify(completeRow), 'nextLinePosition = ', nextLinePosition);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);

        this.emit('line', parsedOffer);
      }
    }

    this.emit('end', importedRowCount);
  }
}
