export enum LogLevel {
	INFO = 'info',
	WARN = 'warn',
	ERROR = 'error',
	DEBUG = 'debug',
}

export interface Log {
	id: number;
	timestamp: Date;
	level: LogLevel;
	message: string;
}

export function parseLog(log: Log): Log {
  return {
    ...log,
    timestamp: new Date(log.timestamp),
  };
}
