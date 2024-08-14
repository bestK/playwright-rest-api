import { ApiProperty } from '@midwayjs/swagger';

export class AssertedEvent {
  @ApiProperty({ type: String, description: 'Type of the event' })
  type: string;

  @ApiProperty({ type: String, description: 'URL associated with the event' })
  url: string;

  @ApiProperty({ type: String, description: 'Title of the event' })
  title: string;
}

export class Request {
  @ApiProperty({ type: String, description: 'HTTP method for the request' })
  method: string;

  @ApiProperty({ type: String, description: 'URL for the request' })
  url: string;

  @ApiProperty({
    type: Object,
    description: 'Headers for the request',
    required: false,
  })
  headers?: Record<string, string>;

  @ApiProperty({
    type: Object,
    description: 'Data payload for the request',
    required: false,
  })
  data?: any;
}

export class Step {
  @ApiProperty({ type: String, description: 'Type of the step' })
  type: string;

  @ApiProperty({
    type: Number,
    description: 'Width of the step',
    required: false,
  })
  width?: number;

  @ApiProperty({
    type: Number,
    description: 'Height of the step',
    required: false,
  })
  height?: number;

  @ApiProperty({
    type: String,
    description: 'URL of the step',
    required: false,
  })
  url?: string;

  @ApiProperty({
    type: [Array],
    description: 'Selectors of the step',
    required: false,
  })
  selectors?: string[][];

  @ApiProperty({
    type: String,
    description: 'Value of the step',
    required: false,
  })
  value?: string;

  @ApiProperty({
    type: [AssertedEvent],
    description: 'Asserted events of the step',
    required: false,
  })
  assertedEvents?: AssertedEvent[];

  @ApiProperty({
    type: Number,
    description: 'Device scale factor',
    required: false,
  })
  deviceScaleFactor?: number;

  @ApiProperty({
    type: Boolean,
    description: 'Is mobile device',
    required: false,
  })
  isMobile?: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Has touch capabilities',
    required: false,
  })
  hasTouch?: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Is landscape orientation',
    required: false,
  })
  isLandscape?: boolean;

  @ApiProperty({
    type: Number,
    description: 'Offset X position',
    required: false,
  })
  offsetX?: number;

  @ApiProperty({
    type: Number,
    description: 'Offset Y position',
    required: false,
  })
  offsetY?: number;

  @ApiProperty({
    type: String,
    description: 'Target of the step',
    required: false,
  })
  target?: string;

  @ApiProperty({
    type: Request,
    description: 'Request details',
    required: false,
  })
  request?: Request;

  @ApiProperty({
    type: [Step],
    description: 'Steps to execute before this step',
    required: false,
  })
  before?: Step[];

  @ApiProperty({
    type: [Step],
    description: 'Steps to execute after this step',
    required: false,
  })
  after?: Step[];

  @ApiProperty({
    type: String,
    description: 'return value name for the step',
    required: false,
  })
  returnName?: string;
}

export class JsonInput {
  @ApiProperty({ type: String, description: 'Title of the JSON input' })
  title: string;

  @ApiProperty({
    type: [Step],
    description: 'Steps included in the JSON input',
  })
  steps: Step[];
}
