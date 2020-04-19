import { useState } from "react";
import * as Icons from '../components/Icons'
import IconsList from '../components/Icons/icons-list.json'
import debounce from 'lodash/debounce'

export default () => {
  const [query, setQuery] = useState('');

  const debouncedSetQuery = debounce((value) => setQuery(value), 100)

  return (
    <div class="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-gray-700 font-title">Refactoring UI - Icons</h1>
      <div className="container flex flex-col items-center justify-center w-full py-3 mb-8">
        <input type="search" onChange={e => debouncedSetQuery(e.target.value)} className="w-4/12 px-3 py-2 mr-3 border border-gray-300 rounded shadow-sm focus:shadow" placeholder="Search Icons.."/>
      </div>
      <div class="flex flex-wrap">
        {IconsList.filter(({ name }) => new RegExp(query.trim(), 'gi').test(name)).map(({ name, icon }) => {
          const Icon = Icons[icon]

          return (
            <div key={name} className="flex items-center w-full p-3 text-sm sm:1/2 md:w-1/4 lg:w-1/6 hover:shadow active:shadow-sm hover:border-gray-200">
              <Icon className="w-8 mr-4" primary={'icon-primary'} secondary={'icon-secondary'}/> {name}
            </div>
          )
        })}
      </div>

      <div className="fixed bottom-0 left-0 m-4 ml-5 text-gray-500">
        v1.0.2
      </div>
    </div>
  )
}
