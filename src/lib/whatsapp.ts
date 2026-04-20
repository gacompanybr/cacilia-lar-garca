export const WHATSAPP_NUMBER = "5514997944908";
export const WHATSAPP_DISPLAY = "(14) 99794-4908";
export const COMPANY_NAME = "Cacilia M Aredes";
export const COMPANY_FULL = "Cacilia M Aredes Corretora de Imóveis";
export const CRECI = "239353";
export const CITY = "Garça - SP";
export const FACEBOOK_URL = "https://www.facebook.com/share/1B1i63C4Ft/?mibextid=wwXIfr";

export const whatsappLink = (message = "Olá, tenho interesse em um imóvel") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const whatsappPropertyLink = (title: string) =>
  whatsappLink(`Olá, tenho interesse neste imóvel: ${title}`);
