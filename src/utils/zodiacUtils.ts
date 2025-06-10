interface ZodiacSign {
  name: string;
  symbol: string;
  dateRange: string;
}

const zodiacSigns: ZodiacSign[] = [
  { name: 'Widder', symbol: '♈', dateRange: '21. März - 20. April' },
  { name: 'Stier', symbol: '♉', dateRange: '21. April - 20. Mai' },
  { name: 'Zwillinge', symbol: '♊', dateRange: '21. Mai - 21. Juni' },
  { name: 'Krebs', symbol: '♋', dateRange: '22. Juni - 22. Juli' },
  { name: 'Löwe', symbol: '♌', dateRange: '23. Juli - 23. August' },
  { name: 'Jungfrau', symbol: '♍', dateRange: '24. August - 23. September' },
  { name: 'Waage', symbol: '♎', dateRange: '24. September - 23. Oktober' },
  { name: 'Skorpion', symbol: '♏', dateRange: '24. Oktober - 22. November' },
  { name: 'Schütze', symbol: '♐', dateRange: '23. November - 21. Dezember' },
  { name: 'Steinbock', symbol: '♑', dateRange: '22. Dezember - 20. Januar' },
  { name: 'Wassermann', symbol: '♒', dateRange: '21. Januar - 19. Februar' },
  { name: 'Fische', symbol: '♓', dateRange: '20. Februar - 20. März' }
];

export const getZodiacSign = (date: Date): ZodiacSign => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 20)) return zodiacSigns[0];
  if ((month === 4 && day >= 21) || (month === 5 && day <= 20)) return zodiacSigns[1];
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return zodiacSigns[2];
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return zodiacSigns[3];
  if ((month === 7 && day >= 23) || (month === 8 && day <= 23)) return zodiacSigns[4];
  if ((month === 8 && day >= 24) || (month === 9 && day <= 23)) return zodiacSigns[5];
  if ((month === 9 && day >= 24) || (month === 10 && day <= 23)) return zodiacSigns[6];
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return zodiacSigns[7];
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return zodiacSigns[8];
  if ((month === 12 && day >= 22) || (month === 1 && day <= 20)) return zodiacSigns[9];
  if ((month === 1 && day >= 21) || (month === 2 && day <= 19)) return zodiacSigns[10];
  return zodiacSigns[11];
};