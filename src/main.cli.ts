#!n/bin/env node
import { CLIApplication, HelpCommand, VersionCommand, ImportCommand, GenerateCommand } from './cli/index.js';

function bootstrap() {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
    new GenerateCommand(),
    new VersionCommand(),
    new ImportCommand ()
  ]);

  cliApplication.processCommand(process.argv);
}

bootstrap();
