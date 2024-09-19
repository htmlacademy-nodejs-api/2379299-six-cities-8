import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';

const MIN_PRICE = 100;
const MAX_PRICE = 100000;

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_ROOMS = 1;
const MAX_ROOMS = 8;

const MIN_VISITORS = 1;
const MAX_VISITORS = 10;


export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const createdDate = getRandomItem<string>(this.mockData.createdDates);
    const city = getRandomItem<string>(this.mockData.cities);
    const previewImagePath = getRandomItem<string>(this.mockData.previewImagePaths);
    const photos = getRandomItems<string>(this.mockData.photos).join(';');
    const isPremium = getRandomItem<string>(this.mockData.isPremium);
    const isFavourites = getRandomItem<string>(this.mockData.isFavourites );
    const rating = generateRandomValue(MIN_RATING, MAX_RATING).toString();
    const housingType = getRandomItem<string>(this.mockData.housingTypes);
    const roomsCount = generateRandomValue(MIN_ROOMS, MAX_ROOMS).toString();
    const visitorsCount = generateRandomValue(MIN_VISITORS, MAX_VISITORS).toString();
    const prices = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const conveniences = getRandomItems<string>(this.mockData.conveniences ).join(';');;
    const name = getRandomItem<string>(this.mockData.name );
    const email = getRandomItem<string>(this.mockData.email );
    const avatar = getRandomItem<string>(this.mockData.avatar );
    const password = getRandomItem<string>(this.mockData.password );
    const type = getRandomItem<string>(this.mockData.type );
    const coordsCityPoints = this.mockData.coords;
    const coordsPoint = coordsCityPoints.find(point => point.name === city);

    const coords = coordsPoint ?  getRandomItem<string>(coordsPoint.coords) : '-';
    return [
      title, description, createdDate,
      city, previewImagePath, photos, isPremium, isFavourites,
      rating, housingType, roomsCount, visitorsCount, prices,
      conveniences, name, email, avatar, password, type, coords
    ].join('\t');
  }
}


