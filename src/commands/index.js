import registerListCommand from './list.js';
import registerSearchCommand from './search.js';
import registerDetailCommand from './detail.js';
import registerFavoritesCommand from './favorites.js';
import registerWatchCommand from './watch.js';
import registerAddCommand from './add.js';
import registerRemoveCommand from './remove.js';
import registerConvertCommand from './convert.js';
import registerTrendingCommand from './trending.js';
import registerCompareCommand from './compare.js';
import registerExportCommand from './export.js';
import registerAlertCommand from './alert.js';

export default function registerCommands(program) {
  registerListCommand(program);
  registerSearchCommand(program);
  registerDetailCommand(program);
  registerAddCommand(program);
  registerRemoveCommand(program);
  registerFavoritesCommand(program);
  registerWatchCommand(program);
  registerConvertCommand(program);
  registerTrendingCommand(program);
  registerCompareCommand(program);
  registerExportCommand(program);
  registerAlertCommand(program);
}
