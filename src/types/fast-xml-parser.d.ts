declare module "fast-xml-parser" {
  const parser: {
    parse: (xmlData: string, options?: any) => any;
  };
  export = parser;
}

declare module "fast-xml-parser" {
  export class XMLParser {
    constructor(options?: any);
    parse(xmlData: string): any;
  }
}
