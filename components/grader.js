export default function Grader({ score }) {
  if (score === 100) return <h2>🏆</h2>;
  if (score >= 90 && score < 100) return <h2>👌</h2>; // 90-99
  if (score >=80 && score <90)  return<h2>😕</h2>// 80-89
  if (score >=70 && score <80)  return<h2>👎</h2>// 
  if (score >=60 && score <70)  return<h2>🤮</h2>// 
  if (score < 60) return <h2>💩</h2>;
  else {
    return <h2>Not able to calculate score</h2>;
  }
}
