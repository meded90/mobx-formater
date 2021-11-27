import { default as installMobxFormatter, NAME_RULE, removeMobxFormatter } from '../index';
import SpyInstance = jest.SpyInstance;

type ArgumentTypes<F> = F extends (...args: infer A) => unknown ? A : never;

const windowFack = {} as any;
const mobxFack: ArgumentTypes<typeof installMobxFormatter>[1] = {
  isObservable: () => true,
  toJS: (obj) => obj,
};
let windowSpy: SpyInstance<Window>;

describe('Mobx Formatter', function () {
  
  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
  });
  
  afterEach(() => {
    windowSpy.mockRestore();
  });
  describe('install()', function () {
    it('should define the devtools formatter global and add formatter if it does not exist', function () {
      installMobxFormatter(windowFack, mobxFack)
      
      expect(Array.isArray(windowFack.devtoolsFormatters)).toBeTruthy()
      expect(windowFack.devtoolsFormatters.length).toBe(1);
      expect(windowFack.devtoolsFormatters[0].type).toBe(NAME_RULE)
    });
    
    // it('should append the formatter to devtools global if it does already exist', function () {
    //   this.window.devtoolsFormatters = [{}];
    //
    //   this.formatter.install();
    //
    //   expect(this.window.devtoolsFormatters).to.be.an('array');
    //   expect(this.window.devtoolsFormatters).to.have.length(2);
    //   expect(this.window.devtoolsFormatters[1]).to.equal(this.debugFormatter);
    // });
  });
})
