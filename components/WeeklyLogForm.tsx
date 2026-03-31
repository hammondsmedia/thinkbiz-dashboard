'use client';

import { useState } from 'react';

export function WeeklyLogForm() {
  const [weekEnding, setWeekEnding] = useState('');
  const [visitorsBrought, setVisitorsBrought] = useState(0);
  const [oneOnOnesHad, setOneOnOnesHad] = useState(0);
  const [referralsGiven, setReferralsGiven] = useState(0);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = {
      weekEnding,
      visitorsBrought,
      oneOnOnesHad,
      referralsGiven,
    };
    console.log('--- Weekly Log Form Data ---');
    console.log(formData);
    // Reset form after submission
    setWeekEnding('');
    setVisitorsBrought(0);
    setOneOnOnesHad(0);
    setReferralsGiven(0);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold leading-6 text-card-foreground">Log Your Weekly Activity</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Submit your stats for the week to keep your dashboard up to date.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
          <div>
            <label htmlFor="week-ending" className="block text-sm font-medium leading-6 text-foreground">
              Week Ending Date
            </label>
            <div className="mt-2">
              <input
                type="date"
                id="week-ending"
                name="week-ending"
                value={weekEnding}
                onChange={(e) => setWeekEnding(e.target.value)}
                required
                className="block w-full rounded-md border-0 bg-input py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-ring placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="visitors-brought" className="block text-sm font-medium leading-6 text-foreground">
              Visitors Brought
            </label>
            <div className="mt-2">
              <input
                type="number"
                id="visitors-brought"
                name="visitors-brought"
                value={visitorsBrought}
                onChange={(e) => setVisitorsBrought(parseInt(e.target.value, 10) || 0)}
                min="0"
                required
                className="block w-full rounded-md border-0 bg-input py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-ring placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="one-on-ones" className="block text-sm font-medium leading-6 text-foreground">
              1-on-1s Had
            </label>
            <div className="mt-2">
              <input
                type="number"
                id="one-on-ones"
                name="one-on-ones"
                value={oneOnOnesHad}
                onChange={(e) => setOneOnOnesHad(parseInt(e.target.value, 10) || 0)}
                min="0"
                required
                className="block w-full rounded-md border-0 bg-input py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-ring placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="referrals-given" className="block text-sm font-medium leading-6 text-foreground">
              Referrals Given
            </label>
            <div className="mt-2">
              <input
                type="number"
                id="referrals-given"
                name="referrals-given"
                value={referralsGiven}
                onChange={(e) => setReferralsGiven(parseInt(e.target.value, 10) || 0)}
                min="0"
                required
                className="block w-full rounded-md border-0 bg-input py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-ring placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Submit Log
          </button>
        </div>
      </form>
    </div>
  );
}
