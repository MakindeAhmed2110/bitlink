/**
 * Virtual Card Generator
 * Generates deterministic card details based on wallet address
 */

export interface CardDetails {
  cardName: string
  cardNumber: string
  cvv: string
  expiryMonth: string
  expiryYear: string
  billingAddress: string
  zipCode: string
}

/**
 * Generate a deterministic pseudo-random number from a seed
 */
function seededRandom(seed: number): () => number {
  let state = seed
  return function() {
    state = (state * 1664525 + 1013904223) % 2**32
    return state / 2**32
  }
}

/**
 * Convert address to a numeric seed
 */
function addressToSeed(address: string): number {
  return parseInt(address.slice(2, 10), 16)
}

/**
 * Generate a Mastercard-compliant card number from an address
 * Mastercard cards start with 51-55 or 2221-2720
 */
function generateCardNumber(seedFn: () => number): string {
  // Use range 52-55 for more variety
  const prefix = 52 + Math.floor(seedFn() * 4)
  const middleDigits: number[] = []
  
  // Generate 12 middle digits
  for (let i = 0; i < 12; i++) {
    middleDigits.push(Math.floor(seedFn() * 10))
  }
  
  const partialCard = `${prefix}${middleDigits.join('')}`
  
  // Calculate Luhn check digit
  const checkDigit = calculateLuhnCheckDigit(partialCard)
  
  return `${partialCard}${checkDigit}`
}

/**
 * Luhn algorithm to calculate check digit
 */
function calculateLuhnCheckDigit(number: string): number {
  let sum = 0
  let isEven = false
  
  // Process from right to left
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i])
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  const remainder = sum % 10
  return remainder === 0 ? 0 : 10 - remainder
}

/**
 * Generate CVV (3 digits)
 */
function generateCVV(seedFn: () => number): string {
  let cvv = ''
  for (let i = 0; i < 3; i++) {
    cvv += Math.floor(seedFn() * 10)
  }
  return cvv
}

/**
 * Generate expiry date (MM/YY format, valid for 3-5 years)
 */
function generateExpiryDate(seedFn: () => number): { month: string; year: string } {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  
  // Add 3-5 years
  const yearsToAdd = 3 + Math.floor(seedFn() * 3)
  const expiryYear = currentYear + yearsToAdd
  
  // Random month
  const expiryMonth = Math.floor(seedFn() * 12) + 1
  
  return {
    month: expiryMonth.toString().padStart(2, '0'),
    year: expiryYear.toString().slice(-2),
  }
}

/**
 * Generate random US billing address
 */
function generateBillingAddress(seedFn: () => number): { address: string; zipCode: string } {
  const streets = [
    'Main St',
    'Park Ave',
    'Oak Dr',
    'Cedar Ln',
    'Maple Rd',
    'Elm St',
    'Washington Blvd',
    'Lincoln Ave',
    'Church St',
    'Broadway',
  ]
  
  const cities = [
    { name: 'New York', zip: '10001' },
    { name: 'Los Angeles', zip: '90001' },
    { name: 'Chicago', zip: '60601' },
    { name: 'Houston', zip: '77001' },
    { name: 'Phoenix', zip: '85001' },
    { name: 'Philadelphia', zip: '19101' },
    { name: 'San Antonio', zip: '78201' },
    { name: 'San Diego', zip: '92101' },
    { name: 'Dallas', zip: '75201' },
    { name: 'San Jose', zip: '95101' },
  ]
  
  const streetIndex = Math.floor(seedFn() * streets.length)
  const cityIndex = Math.floor(seedFn() * cities.length)
  const streetNumber = Math.floor(seedFn() * 9999) + 1
  const aptNumber = seedFn() > 0.7 ? `, Apt ${Math.floor(seedFn() * 500) + 1}` : ''
  
  return {
    address: `${streetNumber} ${streets[streetIndex]}${aptNumber}, ${cities[cityIndex].name}, NY`,
    zipCode: cities[cityIndex].zip,
  }
}

/**
 * Format card number with spaces (XXXX XXXX XXXX XXXX)
 */
function formatCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '')
  const parts = cleaned.match(/.{1,4}/g)
  return parts ? parts.join(' ') : cleaned
}

/**
 * Main function to generate card details from address
 */
export function generateCardDetails(address: string, cardName: string): CardDetails {
  const seed = addressToSeed(address)
  const random = seededRandom(seed)
  
  const cardNumber = generateCardNumber(random)
  const cvv = generateCVV(random)
  const expiry = generateExpiryDate(random)
  const billing = generateBillingAddress(random)
  
  return {
    cardName: cardName || 'Bitlink Card',
    cardNumber: formatCardNumber(cardNumber),
    cvv,
    expiryMonth: expiry.month,
    expiryYear: expiry.year,
    billingAddress: billing.address,
    zipCode: billing.zipCode,
  }
}

