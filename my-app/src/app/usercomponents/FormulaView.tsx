import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function FormulaView() {
  return (
    <div className="space-y-6">
      {/* Gumbel Distribution */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-right">توزیع گامبل (Gumbel Distribution)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg text-center font-mono">
            <div className="text-lg mb-4">
              <span className="italic">F(x)</span> = exp(-exp(-
              <span className="italic">α</span>(
              <span className="italic">x</span> - <span className="italic">μ</span>)))
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              where <span className="italic">α</span> = 1.282 / 
              <span className="italic">σ</span> and{' '}
              <span className="italic">μ</span> is the mode
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 text-right mt-4">
            این توزیع برای مدل‌سازی رویدادهای آب و هوایی شدید مانند حداکثر دما، حداقل دما، و
            بارش استفاده می‌شود.
          </p>
        </CardContent>
      </Card>

      {/* Coincidence Factor */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-right">ضریب همزمانی (Coincidence Factor)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg text-center font-mono">
            <div className="text-lg mb-4">
              <span className="italic">CF</span> ={' '}
              <span className="text-2xl">
                <span className="border-t border-black dark:border-white px-2">
                  <span className="italic">D</span>
                  <sub>max</sub>
                </span>
                <span className="mx-2">/</span>
                <span className="border-t border-black dark:border-white px-2">
                  Σ<span className="italic">D</span>
                  <sub>i</sub>
                </span>
              </span>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <span className="italic">D</span>
              <sub>max</sub> = Maximum Diversified Demand
              <br />
              Σ<span className="italic">D</span>
              <sub>i</sub> = Sum of Individual Maximum Demands
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 text-right mt-4">
            ضریب همزمانی نسبت حداکثر تقاضای متنوع به مجموع حداکثر تقاضاهای فردی است.
            این ضریب برای طراحی شبکه‌های توزیع برق استفاده می‌شود.
          </p>
        </CardContent>
      </Card>

      {/* Load Estimation Formula */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-right">فرمول تخمین بار (Load Estimation)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg text-center font-mono">
            <div className="text-lg mb-4">
              <span className="italic">P</span>
              <sub>total</sub> = <span className="italic">CF</span> ×{' '}
              <span className="italic">N</span> × <span className="italic">P</span>
              <sub>avg</sub> × <span className="italic">DF</span>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <div>
                <span className="italic">CF</span> = Coincidence Factor
              </div>
              <div>
                <span className="italic">N</span> = Number of Consumers
              </div>
              <div>
                <span className="italic">P</span>
                <sub>avg</sub> = Average Power per Consumer
              </div>
              <div>
                <span className="italic">DF</span> = Demand Factor
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 text-right mt-4">
            این فرمول برای تخمین بار کل در یک منطقه خاص بر اساس تعداد مصرف‌کنندگان و
            ضرایب مختلف استفاده می‌شود.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
