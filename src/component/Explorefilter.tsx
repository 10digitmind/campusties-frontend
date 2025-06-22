import React, { useState } from 'react';
import '../styles/exploreFilter.css';

interface FilterProps {
  onApply: (filters: any) => void;
}

const institutions = [
  'UNILAG', 'OAU', 'UI', 'LASU', 'UNIBEN', 'UNN', 'ABU', 'FUTA', 'Covenant', 'Babcock',
  'Other'
];

const ExploreFilter: React.FC<FilterProps> = ({ onApply }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [gender, setGender] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [institution, setInstitution] = useState('');
  const [level, setLevel] = useState('');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [subscribedOnly, setSubscribedOnly] = useState(false);

  const applyFilters = () => {
    onApply({
      gender,
      lookingFor,
      institution,
      level,
      onlineOnly,
      verifiedOnly,
      subscribedOnly,
    });
    setShowFilter(false); // auto-collapse on apply
  };

  return (
    <div className="filter-container">
      <div className="filter-toggle" onClick={() => setShowFilter(!showFilter)}>
        {showFilter ? 'Hide Filters ▲' : 'Show Filters ▼'}
      </div>
  
      {showFilter && (
        <div  className="filter-body">
          <div className="filter-group">
            <label>Gender</label>
            <select value={gender} onChange={e => setGender(e.target.value)}>
              <option value="">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
  
          <div className="filter-group">
            <label>Looking For</label>
            <select value={lookingFor} onChange={e => setLookingFor(e.target.value)}>
              <option value="">Any</option>
              <option value="serious relationship">Serious Relationship</option>
              <option value="casual dating">Casual Dating</option>
              <option value="friendship">Friendship</option>
              <option value="one night stand">One Night Stand</option>
              <option value="fling">Fling</option>
              <option value="study buddy">Study Buddy</option>
            </select>
          </div>
  
          <div className="filter-group">
            <label>Institution</label>
            <input
              list="institution-list"
              placeholder="Search institution"
              value={institution}
              onChange={e => setInstitution(e.target.value)}
            />
            <datalist id="institution-list">
              {institutions.map(inst => (
                <option key={inst} value={inst} />
              ))}
            </datalist>
          </div>
  
          <div className="filter-group">
            <label>Level</label>
            <select value={level} onChange={e => setLevel(e.target.value)}>
              <option value="">Any</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
              <option value="Graduate">Graduate</option>
            </select>
          </div>
  
          <div className="filter-checkboxes">
            <label>
              <input
                type="checkbox"
                checked={onlineOnly}
                onChange={e => setOnlineOnly(e.target.checked)}
              />
              Online Only
            </label>
            <label>
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={e => setVerifiedOnly(e.target.checked)}
              />
              Verified Only
            </label>
            <label>
              <input
                type="checkbox"
                checked={subscribedOnly}
                onChange={e => setSubscribedOnly(e.target.checked)}
              />
              Subscribed Only
            </label>
          </div>
  
          <button className="apply-button" onClick={applyFilters}>Apply Filters</button>
        </div>
      )}
    </div>
  );
  
};

export default ExploreFilter;
