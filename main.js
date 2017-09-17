function renderEstimates() {
	const pending = document.getElementsByClassName('pending').length !== 0;

	if (pending) {
		return setTimeout(renderEstimates, 300);
	}

	const $issueTable = document.getElementById('issuetable');

	if ($issueTable) {
		try {
			const $existingTotalsRows = document.getElementsByClassName('jira-helper-totals-row');
			for (const $row of [...$existingTotalsRows]) {
				$row.remove();
			}
			const $tableBody = $issueTable.getElementsByTagName('tbody')[0];
			const $rows = $tableBody.childNodes;
			const rawEstimates = Array.prototype.map.call($rows, $row =>
				$row.getElementsByClassName('timeoriginalestimate')[0].innerHTML);
			const $totalsRow = $rows[0].cloneNode(true);
	
			$totalsRow.setAttribute('class', 'jira-helper-totals-row');
			$totalsRow.removeAttribute('rel');
			$totalsRow.removeAttribute('data-issuekey');
	
			const estimate = {
				w: 0,
				d: 0,
				h: 0,
				m: 0,
				normalize() {
					let { w, d, h, m } = this;
	
					if (m > 59) {
						h += (m - m % 60) / 60;
						m = m % 60;
					}
	
					if (h > 7) {
						d += (h - h % 8) / 8;
						h = h % 8;
					}
	
					if (d > 4) {
						w += (d - d % 5) / 5;
						d = d % 5;
					}
	
					Object.assign(this, { w, d, h, m });
				},
				get verbose() {
					const { w, d, h, m } = this;
	
					return `
						${w ? `${w}w` : ''}
						${d ? `${d}d` : ''}
						${h ? `${h}h` : ''}
						${m ? `${m}m` : ''}
					`;
				},
				get days() {
					const { w, d, h, m } = this;
					const days = w * 5 + d + h / 8 + m / 8 / 60;
					const daysRound = parseFloat(days.toFixed(2));
					const pre = days === daysRound ? '' : '~';
	
					return `${pre}${daysRound} days`;
				},
				get hours() {
					const { w, d, h, m } = this;
					const hours = w * 5 * 8 + d * 8 + h + m / 60;
					const hoursRound = parseFloat(hours.toFixed(2));
					const pre = hours === hoursRound ? '' : '~';
	
					return `${pre}${hoursRound} hours`;
				}
			};
	
			rawEstimates.forEach(est => {
				const parts = est.split(', ');
	
				parts.forEach(part => {
					const match = /(^\d+(?:\.\d+)?) (\w)/.exec(part);
	
					match && (estimate[match[2]] += Number(match[1]));
				});
			});
	
			estimate.normalize();
	
			$totalsRow.childNodes.forEach($row => {
				if ($row.className === 'timeoriginalestimate') {
					$row.innerHTML = `
						<div>${estimate.verbose}</div>
						<div>${estimate.days}</div>
						<div>${estimate.hours}</div>
					`;
				} else {
					$row.innerHTML = '';
				}
			});
	
			$tableBody.prepend($totalsRow);
			$tableBody.append($totalsRow.cloneNode(true));
		} catch(e) {
			const message = 'jira-helper: OOPS! Something went wrong';
			console.info(`${message}\n${e}`);
			alert(`${message}; Check console for details`);
		}
	}
}

renderEstimates();
