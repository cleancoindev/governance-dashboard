import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import find from 'ramda/src/find';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import NotFound from './NotFound';
import Button from '../components/Button';
import Card from '../components/Card';
import { VotePercentage } from '../components/VoteTally';
import WithTally from '../components/hocs/WithTally';
import Vote from '../components/modals/Vote';
import Timer from '../components/Timer';
import { modalOpen } from '../reducers/modal';
import { activeCanVote, getActiveVotingFor } from '../reducers/accounts';
import { toSlug, eq } from '../utils/misc';
import theme, { colors, fonts } from '../theme';

const ProposalDetails = styled.div`
  max-width: 59%;
  flex-direction: column;
  height: 100%;
  display: flex;
  justify-content: space-around;
`;

const StyledTop = styled.div`
  height: 311px;
  background-color: rgb(${colors.white});
  border-bottom: 2px solid #eaeaea;
  text-align: left;
  padding: 54px 16px;
`;

const StyledCenter = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1140px;
  margin: auto;
`;

const StyledTitle = styled.p`
  font-size: 28px;
  color: ${theme.text.darker_default};
  line-height: 46px;
`;

const StyledBody = styled.p`
  line-height: 30px;
  font-size: 17px;
  color: #546978;
  height: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const WhiteBackground = styled.div`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  margin-bottom: 34px;
`;

const SubHeading = styled.p`
  color: ${theme.text.darker_default};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-top: -10px;
  font-size: ${fonts.size.large};
  font-weight: ${fonts.weight.medium};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  flex: none;
  position: relative;
  @media screen and (max-width: 736px) {
    display: ${({ isAlwaysVisible }) => (isAlwaysVisible ? 'block' : 'none')};
  }
`;

const Body = styled.p`
  font-size: 16px;
  line-height: 26px;
  color: #546978;
  height: 52px;
  overflow: hidden;
`;

// TODO Styled body & body are confusingly similar

const Topic = ({ match, topics, fetching, canVote, modalOpen, votingFor }) => {
  // fetching
  const topicSlug = match.params.topicSlug;
  const topic = find(({ topic }) => toSlug(topic) === topicSlug, topics);
  if (topic === undefined) return <NotFound />;
  const { topic: topicTitle, topic_blurb, active, govVote, proposals } = topic;
  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledTop>
          <StyledCenter>
            <StyledTitle>{topicTitle}</StyledTitle>
            <StyledBody dangerouslySetInnerHTML={{ __html: topic_blurb }} />
            {active ? (
              <Timer endTimestamp={topic.end_timestamp} small mt="10" />
            ) : null}
          </StyledCenter>
        </StyledTop>
      </WhiteBackground>

      <Card>
        <Card.Top
          active={active}
          govVote={govVote}
          topicTitle={topicTitle}
          collapsable={true}
          startCollapsed={false}
        />
        {proposals.map(proposal => (
          <Card.Element key={proposal.title} height={151}>
            <ProposalDetails>
              <Link to={`/${toSlug(topicTitle)}/${toSlug(proposal.title)}`}>
                <SubHeading>{proposal.title}</SubHeading>
              </Link>
              <Body
                dangerouslySetInnerHTML={{ __html: proposal.proposal_blurb }}
              />
              {active ? (
                <Timer endTimestamp={proposal.end_timestamp} small mb="-6" />
              ) : null}
            </ProposalDetails>
            <div>
              <WithTally candidate={proposal.source}>
                {({ loadingApprovals, percentage }) => (
                  <VotePercentage
                    loadingApprovals={loadingApprovals}
                    percentage={percentage}
                  />
                )}
              </WithTally>
              <Button
                disabled={!canVote}
                loading={fetching}
                onClick={() =>
                  modalOpen(Vote, {
                    proposal: {
                      address: proposal.source,
                      title: proposal.title
                    }
                  })
                }
              >
                {eq(votingFor, proposal.source)
                  ? 'Withdraw vote'
                  : 'Vote for this Proposal'}
              </Button>
            </div>
          </Card.Element>
        ))}
      </Card>
    </React.Fragment>
  );
};

Topic.propTypes = {
  match: PropTypes.object.isRequired,
  topics: PropTypes.array.isRequired
};

Topic.defaultProps = {
  match: '',
  topics: []
};

const reduxProps = ({ topics, accounts }) => ({
  topics: topics,
  fetching: accounts.fetching,
  canVote: activeCanVote({ accounts }),
  votingFor: getActiveVotingFor({ accounts })
});

export default connect(
  reduxProps,
  { modalOpen }
)(Topic);
