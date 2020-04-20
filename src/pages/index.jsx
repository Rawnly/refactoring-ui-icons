import { useState, useEffect } from 'react';
import * as Icons from '../components/Icons';
import { CountingStars } from '../components/CountingStars';
import IconsList from '../components/Icons/icons-list.json';
import debounce from 'lodash/debounce';
import cx from 'classnames';

export default () => {
	const [icons, setIcons] = useState(IconsList);
	const [query, setQuery] = useState('');

	const debouncedSetQuery = debounce((value) => setQuery(value), 100);

	useEffect(() => {
		setIcons(IconsList.filter(({ name }) => new RegExp(query.trim(), 'gi').test(name)));
	}, [query]);

	return (
		<div class='container mx-auto px-4 py-10'>
			<h1 className='text-3xl font-bold text-center text-gray-700 font-title'>Refactoring UI - Icons</h1>
			<div className='flex flex-col items-start justify-center w-4/12 mx-auto my-8'>
				<input
					type='search'
					onChange={(e) => debouncedSetQuery(e.target.value)}
					className='w-full px-3 py-2 mr-3 transition transition-shadow duration-200 border border-gray-300 rounded shadow-sm focus:shadow'
					placeholder='Search Icons..'
				/>
				<small className='mt-1 text-gray-400'>Found {icons.length} Icons</small>
			</div>
			<div
				class={cx('flex flex-wrap', {
					'items-center': icons.length == 0,
					'justify-center': icons.length == 0,
				})}>
				{!icons.length && <CountingStars className='w-1/3' />}

				{icons.map(({ name, icon }) => {
					const Icon = Icons[icon];

					return (
						<div
							key={name}
							className='flex items-center w-full p-3 text-sm sm:1/2 md:w-1/4 lg:w-1/6 hover:shadow active:shadow-sm hover:border-gray-200'>
							<Icon className='w-8 mr-4' primary={'icon-primary'} secondary={'icon-secondary'} /> {name}
						</div>
					);
				})}
			</div>

			<div className='fixed bottom-0 left-0 m-4 ml-5 text-gray-500'>v1.0.2</div>
		</div>
	);
};
