export interface IWindowDimensions {
    width: number;
    height: number;
    aspect: number;
    devicePixelRatio: number;
  }
  
  export function getWindowSize(): IWindowDimensions {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;
    const devicePixelRatio = window.devicePixelRatio;
    return { width: width, height: height, aspect: aspect, devicePixelRatio: devicePixelRatio };
  }

  export function addElementToBody(element: HTMLElement): void {
    document.body.appendChild( element );
  }

  export function addElementsToBody(elements: HTMLElement[]): void {
    elements.forEach(element => addElementToBody(element));
  }