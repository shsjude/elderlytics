export interface Facility {
    id: number;
    facilityName: string;
    streetAddress: string;
    facilityProfileURL: string;
    averageReviewScore: number | null;
    facilityBio: string;
    facAmenities: string;
    telephoneNum1: string;
    telephoneNum2?: string;
    ownershipGroup: string;
    city: string;
    state: string;
    zipCode: string;
    careType1: string;
    careType2?: string;
    careType3?: string;
    roomType1?: string;
    roomType1Price?: string;
    roomType2?: string;
    roomType2Price?: string;
    roomType3?: string;
    roomType3Price?: string;
    uploadDate: string;
  }
  